import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import EmailsShow from "../components/emailsShowProps";
import { toast } from 'react-toastify'; 
import { api } from "~/utils/api";
import { signIn, signOut, useSession } from "next-auth/react";

const Home: NextPage = () => {
  const { data: session } = useSession();
  const { data: secretMessage, isLoading, isError } = api.gmail.getEmailList.useQuery(undefined, {
    enabled: !!session,
    onError: (err) => { toast.error('Error fetching email list: ' + err.message);
  } });

  const router = useRouter();
  if (session) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto p-4">
        <header className="flex flex-row justify-between">
          <h1 className="text-2xl font-bold mb-4">Gmail Inbox!!</h1>
              <button
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                onClick={() => {
                  signOut().catch((err) => toast.error('Error signing in: ' + String(err)));
                }}
              >
                Sign out
              </button>
        </header>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg">
              Signed in as {session.user.email} <br />
            </h2>
          </div>
          {isError && <div>Error fetching email list.</div>}
          {isLoading ? <div>Loading...</div> : <EmailsShow />}
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-100">
  <div className="container mx-auto p-4">
    <header> <h1 className="text-2xl font-bold mb-4">Gmail Inbox!!</h1></header> 
    <div className="flex justify-center items-center flex-col">
      <h2 className="text-lg mb-4">You are not signed in!!</h2>
      <button
        className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow flex items-center"
        onClick={() => {
          signIn("google").catch((err:unknown) => toast.error('Error signing in: ' + String(err)));
        }}
      >
        <svg
          className="w-5 h-5 mr-2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
        >
          <path
            d="M20.6 10.7H12v2.5h5.1c-.5 2.1-2.5 3.5-4.8 3.5-2.8 0-5-2.2-5-5s2.2-5 5-5c1.3 0 2.4.5 3.2 1.4l2.3-2.2C16.6 2.7 14.6 2 12.5 2 7.8 2 4 5.8 4 10.5s3.8 8.5 8.5 8.5c4.3 0 7.3-2.6 7.3-6.3 0-.4-.1-.7-.1-1.1z"
          />
        </svg>
        Sign in with Google
      </button>
    </div>
  </div>
</div>

  );
}

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined },
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
