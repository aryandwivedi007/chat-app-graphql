import { yupResolver } from "@hookform/resolvers/yup";
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

import PasswordInput from "./PasswordInput";
import { useMutation } from "@apollo/client"; // ✅ Import Apollo useMutation
import { LOGIN_USER } from "../graphql/mutation"; // ✅ Import GraphQL mutation

const validation = yup.object({
  email: yup.string().email("Email is invalid").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(5, "Minimumn 5 chars are required")
    .max(16, "Miximumn 16 chars allowed"),
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

export default function LoginForm() {
  const theme = useTheme();
  const style = useStyle(theme);
  const [loginUser, { loading }] = useMutation(LOGIN_USER);

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(validation),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await loginUser({
        variables: {
          email: data.email,
          password: data.password,
        },
      });
  
      const tokens = response.data?.login;
      
      if (tokens) {
        localStorage.setItem("accessToken", tokens.accessToken);
        localStorage.setItem("refreshToken", tokens.refreshToken);
        toast.success("User logged in successfully!");
        console.log("✅ Login successful. Redirecting...");
        navigate("/", { replace: true });
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
                <b>Welcome!</b>
              </Typography>
              <Typography my={1}>Sign in to continue.</Typography>
            </Box>
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
              label="password"
              error={Boolean(errors.password?.message)}
              helperText={errors.password?.message}
              {...register("password")}
            />
            <Button
              type="submit"
              sx={style.button}
              variant="contained"
              fullWidth
              disabled={!isValid}
            >
              Log in
            </Button>
            <Typography>
              Don&apos;t have an account?{" "}
              <NavLink style={style.link as CSSProperties} to="/signup">
                Sign up
              </NavLink>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
