import { google } from "googleapis";
import { env } from "../../../env.mjs";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

// Define function to fetch list of emails
async function listEmails(accessToken: string) {
  try {
    return await fetch(
      "https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=10",
      {
        method: "GET",
        headers: new Headers({ Authorization: `Bearer ${accessToken}` }),
      }
    )
      .then((res) => res.json())
      .then((item:  {messages:{ id: string; threadId: string }[]}) => {
        return item;
      })
      .catch((e) => console.error(e));
  } catch (error) {
    throw new Error(String(error));
  }
}

// Define function to fetch list of emails by ID
async function listEmailsID(accessToken: string, messageId: string) {
  return await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages/${String(messageId)}`,
    {
      method: "GET",
      headers: new Headers({ Authorization: `Bearer ${accessToken}` }),
    }
  )
    .then((res) => res.json())
    .then((item:{id:string,msg:string,payload:{headers:{name:string,value:string}[]},}) => {
      let result = { id: String(item.id), msg: String(item.msg) };

      Array.from(item.payload.headers).forEach((message:{name:string,value:string}) => {
        if (
          message.name === "To" ||
          message.name === "Date" ||
          message.name === "Subject" ||
          message.name === "From"
        ) {
          result = { ...result, [message.name]: message.value };
        }
      });

      return result;
    })
    .catch((e) => {
      console.error(e);
      throw new Error("Error in requesting email data");
    });
}

// Create router for Gmail API
export const gmailRouter = createTRPCRouter({
  getEmailList: protectedProcedure.query(async ({ ctx }) => {
    try {
      // Find account in database
      const account = await ctx.prisma.account.findFirst({
        where: {
          id: ctx.session.user.id,
        },
      });

      if (!account || !account.access_token) {
        throw new Error("Do not have access");
      }

      // Create OAuth2 client for Google API
      const oAuth2Client = new google.auth.OAuth2(
        env.GOOGLE_CLIENT_ID,
        env.GOOGLE_CLIENT_SECRET,
        env.NEXTAUTH_URL
      );

      // Set credentials for OAuth2 client
      oAuth2Client.setCredentials({
        access_token: account.access_token,
        refresh_token: account.refresh_token,
      });
    
      // Fetch list of emails and their IDs
      const emailsRun:unknown = await Promise.all(
        ((await listEmails(account.access_token ))?.messages ?? []).map(
          async (item: { id: string; threadId: string }) =>
            await listEmailsID(account.access_token ?? "", item.id).then(
              (inc) => inc
            )
        )
      );

      return emailsRun;
    } catch (error) {
      console.error(error);
      throw new Error("Error in email request");
    }
  }),
});
