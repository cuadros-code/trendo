import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SingupValidation } from "@/lib/validation"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import Loader from "@/components/shared/Loader"
import { useToast } from "@/components/ui/use-toast"
import { useCreateUserAccountMutation, useSignAccountMutation } from "@/lib/react-query/queriesAndMutations"

const SignupForm = () => {

  const { toast } = useToast();
  const { mutateAsync: createUserAccount, isPending: isCreatingAccount } = useCreateUserAccountMutation();
  const { mutateAsync: signInAccount, isPending: isSignIn } = useSignAccountMutation();


  const form = useForm<z.infer<typeof SingupValidation>>({
    resolver: zodResolver(SingupValidation),
    defaultValues: {
      name      : "",
      username  : "",
      email     : "",
      password  : "",
    },
  })

  async function onSubmit(values: z.infer<typeof SingupValidation>) {
    const newUser = await createUserAccount(values);
    if(!newUser) {
      toast({
        title: "Signup failed. Please try again later.",
        variant: "destructive"
      })
    };

    const swession = await signInAccount({ 
      email: values.email, 
      password: values.password 
    });

    if(!swession) {
      toast({
        title: "Signin failed. Please try again later.",
        variant: "destructive"
      })
    }

  }

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="/assets/images/logo.svg" alt="logo" />
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-5">Create a new account</h2>
        <p className="text-light-3 small-medium md:base-regular">To use SnapGram, please enter your account details</p>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3 w-full mt-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" placeholder="jhon doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" placeholder="jhondoe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
              isCreatingAccount 
                ? <div className="flex-center gap-2"> <Loader /> Loading...</div> 
                : "Sign up"
            }
          </Button>
          <p className="text-small-regular text-light-2 text-center mt-1">
            Already have an account? <Link to={'/sign-in'} className="text-primary-500 text-small-semibold ml-1">Log in</Link>
          </p>
        </form>
      </div>
    </Form>
  )
}

export default SignupForm;