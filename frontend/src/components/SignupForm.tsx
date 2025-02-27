import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@apollo/client"; // ✅ Import Apollo useMutation
import { REGISTER_USER } from "../graphql/mutation"; // ✅ Import GraphQL mutation

import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Theme,
  Typography,
  useTheme,
} from "@mui/material";
import { createStyles } from "@mui/styles";
import { CSSProperties } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useRegisterMutation } from "../services/api";
import PasswordInput from "./PasswordInput";

const validation = yup.object({
  email: yup.string().email("Email is invalid").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(5, "Minimumn 5 chars are required")
    .max(16, "Miximumn 16 chars allowed"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Comfirm password is required"),
  name: yup.string().required("Name is required"),
});

const useStyle = (theme: Theme) =>
  createStyles({
    root: {
      maxWidth: 400,
      flex: 1,
      mx: "auto",
    },
    input: {
      mt: 2,
    },
    button: {
      my: 2,
    },
    link: {
      color: theme.palette.primary.main,
    },
  });

type FormData = typeof validation.__outputType;

export default function SignupForm() {
  const theme = useTheme();
  const style = useStyle(theme);
  const [registerUser, { data, loading, error }] = useMutation(REGISTER_USER);

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: yupResolver(validation),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await registerUser({
        variables: {
          name: data.name,
          email: data.email,
          password: data.password,
        },
      });
  
      if (response.data?.register) {
        toast.success("User registered successfully!");
        navigate("/");
      }
    } catch (error: any) {
      const errorMessage =
        error?.graphQLErrors?.[0]?.message || "Something went wrong!";
      toast.error(errorMessage);
    }
  };
  

  return (
    <Box
      height="100vh"
      width="100vw"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Card variant="outlined" sx={style.root}>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Box>
              <Typography variant="h4" component="h1">
                <b>Signup</b>
              </Typography>
            </Box>
            <TextField
              sx={style.input}
              fullWidth
              type="text"
              placeholder="Name"
              label="Name"
              {...register("name")}
              error={Boolean(errors.name?.message)}
              helperText={errors.name?.message}
            />
            <TextField
              sx={style.input}
              fullWidth
              type="text"
              placeholder="Email"
              label="Email"
              {...register("email")}
              error={Boolean(errors.email?.message)}
              helperText={errors.email?.message}
            />
            <PasswordInput
              sx={style.input}
              fullWidth
              type="password"
              placeholder="password"
              label="Password"
              error={Boolean(errors.password?.message)}
              helperText={errors.password?.message}
              {...register("password")}
            />
            <PasswordInput
              sx={style.input}
              fullWidth
              type="password"
              placeholder="Confirm Password"
              label="Confirm password"
              error={Boolean(errors.confirmPassword?.message)}
              helperText={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />
            <Button
              type="submit"
              sx={style.button}
              variant="contained"
              fullWidth
              disabled={!isValid}
            >
              Signup
            </Button>
            <Typography>
              Already have an account?{" "}
              <NavLink style={style.link as CSSProperties} to="/login">
                Sign in
              </NavLink>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
