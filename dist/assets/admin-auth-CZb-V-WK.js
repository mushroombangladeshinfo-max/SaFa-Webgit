const s=["mushroombangladesh.info@gmail.com","quazishab@gmail.com"];async function i(n){const{data:{session:a}}=await n.auth.getSession();return!a||!s.includes(a.user.email)?null:a}export{i as r};
