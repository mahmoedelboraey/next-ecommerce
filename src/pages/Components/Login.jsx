
"use client"
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function Login() {

  const router = useRouter();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email")
      .required("Email is required"),

    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const formik = useFormik({

    initialValues: {
      email: "",
      password: "",
    },

    validationSchema,

    onSubmit: async (
      values,
      { setSubmitting, setErrors }
    ) => {

      try {

        const res = await signIn(
          "credentials",
          {
            email: values.email,
            password: values.password,
            redirect: false,
          }
        );

        if (res?.error) {

          setErrors({
            email: res.error,
          });

        } else {

          router.push("/Home");

        }

      } catch (error) {

        setErrors({
          email: "Login failed",
        });

      }

      setSubmitting(false);
    },
  });

  return (
    <div className="container-fluid vh-100">

      <div className="row h-100">

        <div className="col-md-6 d-none d-md-block p-0">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"
            alt="login"
            className="w-100 h-100 object-fit-cover"
          />
        </div>

        <div className="col-md-6 d-flex align-items-center justify-content-center bg-light">

          <div className="w-75">

            <div className="card shadow-lg p-4 border-0 rounded-4">

              <h2 className="text-center mb-4 fw-bold">
                Login
              </h2>

              <form onSubmit={formik.handleSubmit}>

                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="form-control mb-3"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                />

                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="form-control mb-3"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                />

                {formik.errors.email && (
                  <small className="text-danger d-block mb-2">
                    {formik.errors.email}
                  </small>
                )}

                <button
                  className="btn btn-dark w-100 mb-3"
                  type="submit"
                  disabled={formik.isSubmitting}
                >
                  {formik.isSubmitting
                    ? "Logging in..."
                    : "Login"}
                </button>

              </form>

              <button
                className="btn btn-outline-dark w-100 mb-2"
                onClick={() =>
                  signIn("github", {
                    callbackUrl: "/Home",
                  })
                }
              >
                Login with GitHub
              </button>

              <button
                className="btn btn-outline-danger w-100"
                onClick={() =>
                  signIn("google", {
                    callbackUrl: "/Home",
                  })
                }
              >
                Login with Google
              </button>

              <p className="text-center mt-3">
                Don't have an account?{" "}
                <Link href="/register">
                  Register
                </Link>
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

Login.getLayout = function (page) {
  return <>{page}</>;
};
