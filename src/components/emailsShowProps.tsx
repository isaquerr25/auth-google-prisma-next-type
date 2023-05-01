
"user side"

import { useSession } from "next-auth/react";
import { api } from "../utils/api";

function EmailsShow() {
  const { data: session } = useSession();
  const { data: secretMessage } = api.gmail.getEmailList.useQuery(undefined, {
    enabled: !!session,
  });
  

  return (
  
  
    <section>
    <table className="border-collapse w-full">
      <caption className="text-lg font-medium mb-4">Emails</caption>
      <thead>
        <tr>
          <th className="text-left py-2 px-4 border border-gray-300 font-medium">Date</th>
          <th className="text-left py-2 px-4 border border-gray-300 font-medium">From</th>
          <th className="text-left py-2 px-4 border border-gray-300 font-medium">To</th>
          <th className="text-left py-2 px-4 border border-gray-300 font-medium">Subject</th>
        </tr>
      </thead>
      <tbody>
        {Array.isArray(secretMessage) && secretMessage.map((item:{id:string,Date:string,From:string,Subject:string,To:string}) => (
        <tr key={item.id} onClick={() => window.open(`http://mail.google.com/mail/u/0/#inbox/${item.id}`, '_blank')  }  className="hover:bg-[#afc5af] cursor-pointer"
          
          data-href='url://link-for-first-row/'
          
          
         >
            <td className="py-2 px-4 border border-gray-300">{((typeof item.Date !== undefined ?  item.Date : "").split("+")[0] ?? "" ).split("-")[0]}</td>
            <td className="py-2 px-4 border border-gray-300">{(item.From ?? "").replace(/[<>]/gim,"")}</td>
            <td className="py-2 px-4 border border-gray-300">{(item.To ?? "").split(" ")[(item.To).split(" ").length -1 ]?.replace(/[<>]/gim,"") ?? ""}</td>
            <td className="py-2 px-4 border border-gray-300">
            
                {(item.Subject).substring(0, 60) }{item.Subject.length > 60 && "..." }

            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </section>
  );
}

export default EmailsShow;