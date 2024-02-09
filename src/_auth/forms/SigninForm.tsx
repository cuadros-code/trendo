import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SinginValidation } from "@/lib/validation"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import Loader from "@/components/shared/Loader"
import { useToast } from "@/components/ui/use-toast"
import { useSignAccountMutation } from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"

const SigninForm = () => {

  const { toast } = useToast();
  const { mutateAsync: signInAccount, isPending: isSignIn } = useSignAccountMutation();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof SinginValidation>>({
    resolver: zodResolver(SinginValidation),
    defaultValues: {
      email     : "",
      password  : "",
    },
  })

  async function onSubmit(values: z.infer<typeof SinginValidation>) {
    const session = await signInAccount({ 
      email: values.email, 
      password: values.password 
    });

    if(!session) {
      return toast({ title: "Signin failed. Please try again later.",})
    }

    const isLoggedIn = await checkAuthUser();

    if(isLoggedIn) {
      form.reset();
      navigate('/');
    } else {
      return toast({ title: "Signin failed. Please try again later."})
    }

  }

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="/assets/images/logo.svg" alt="logo" />
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-5">Log in to your account</h2>
        <p className="text-light-3 small-medium md:base-regular">
          Welcome back! Please login to your account.
        </p>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3 w-full mt-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" className="shad-input" placeholder="jhondoe@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" placeholder="Enter your password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="shad-button_primary" type="submit">
            {
              isSignIn 
                ? <div className="flex-center gap-2"> <Loader /> Loading...</div> 
                : "Sign in"
            }
          </Button>
          <p className="text-small-regular text-light-2 text-center mt-1">
            Don't have an account? <Link to={'/sign-up'} className="text-primary-500 text-small-semibold ml-1">Sign up</Link>
          </p>
        </form>
      </div>
    </Form>
  )
}

export default SigninForm;