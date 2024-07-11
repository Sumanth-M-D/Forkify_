import { TIMEOUT_SEC } from "./config.js";

const timeout = function (s) {
   return new Promise(function (_, reject) {
     setTimeout(function () {
       reject(new Error(`Request took too long! Timeout after ${s} second`));
     }, s * 1000);
   });
 };

 export async function AJAX(url, uploadData=undefined) {
   try{
      const fetchPro = uploadData ? 
         fetch(url, {
            method: "POST",
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify(uploadData)
         }) 
         : fetch(url);


      const response = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
      const data = await response.json();

      if(!response.ok) throw new Error(`${data.message} (${response.status})`);
      return data;
   } catch(err) {
      throw err;
   }
 }

// export async function getJSON(url) {
//    try{
//       const fetchPro = fetch(url);
//       const response = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
//       const data = await response.json();
//       if(!response.ok) throw new Error(`${data.message} (${response.status})`);

//       return data;
//    } catch(err) {
//       throw err;
//    }
// }
// export async function sendJSON(url, uploadData) {
//    try{
//       const fetchPro = fetch(url, {
//          method: "POST",
//          headers: {
//             'Content-Type': 'application/json',
//          },
//          body: JSON.stringify(uploadData)
//       });
//       console.log(JSON.stringify(uploadData));
//       const response = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
//       const data = await response.json();

//       if(!response.ok) throw new Error(`${data.message} (${response.status})`);
//       return data;
//    } catch(err) {
//       throw err;
//    }
// }

