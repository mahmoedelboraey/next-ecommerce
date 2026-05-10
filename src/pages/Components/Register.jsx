"use client";
import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useRouter } from "next/router";
export default function Register() {
  const router = useRouter();

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, "Name must be at least 3 characters")
      .required("Name is required"),

    email: Yup.string()
      .email("Invalid email")
      .required("Email is required"),

    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),

    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm your password"),

    phone: Yup.string().required("Phone number is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        const data = await res.json();

        if (!res.ok) {
          setErrors({ email: data.message || "Something went wrong" });
        } else {
          router.push("/login");
        }
      } catch (error) {
        setErrors({ email: "Server error" });
      } finally {
        setSubmitting(false);
      }
    },
  });

  

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">

        <div className="col-md-6 d-flex align-items-center justify-content-center bg-light">
          <div className="w-75">

            <div className="card shadow-lg p-4 border-0 rounded-4">
              <h2 className="text-center mb-4">Register</h2>

              <form onSubmit={formik.handleSubmit}>
               
                <div className="mb-3">
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    className="form-control"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <small className="text-danger">{formik.errors.name}</small>
                  )}
                </div>

          
                <div className="mb-3">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="form-control"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <small className="text-danger">{formik.errors.email}</small>
                  )}
                </div>

             
                <div className="mb-3">
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="form-control"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.password && formik.errors.password && (
                    <small className="text-danger">{formik.errors.password}</small>
                  )}
                </div>


                <div className="mb-3">
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    className="form-control"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.confirmPassword &&
                    formik.errors.confirmPassword && (
                      <small className="text-danger">
                        {formik.errors.confirmPassword}
                      </small>
                    )}
                </div>

                <div className="mb-3">
                  <PhoneInput
                    international
                    defaultCountry="EG"
                    value={formik.values.phone}
                    onChange={(value) => formik.setFieldValue("phone", value)}
                    onBlur={() => formik.setFieldTouched("phone", true)}
                    className="form-control"
                  />
                  {formik.touched.phone && formik.errors.phone && (
                    <small className="text-danger">{formik.errors.phone}</small>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-dark w-100"
                  disabled={formik.isSubmitting}
                >
                  {formik.isSubmitting ? "Registering..." : "Register"}
                </button>
              </form>

              <p className="text-center mt-3">
                Already have an account?{" "}
                <Link href="/login" className="text-primary">
                  Login
                </Link>
              </p>
            </div>

          </div>
        </div>

      
       <div className="col-md-6 d-none d-md-block p-0">
  <img
    src="https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=1200&q=80"
    alt="products"
    className="w-100 h-100 object-fit-cover"
  />
</div>

      </div>
    </div>
  );
}


Register.getLayout = function (page) {
  return <>{page}</>;
};