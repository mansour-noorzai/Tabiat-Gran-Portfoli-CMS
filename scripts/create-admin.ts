import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDb } from "../lib/db";
import { User } from "../models";
function arg(name:string){const i=process.argv.indexOf(`--${name}`);return i>=0?process.argv[i+1]:undefined}
async function main(){const email=(arg("email")||process.env.BOOTSTRAP_ADMIN_EMAIL||"").trim().toLowerCase(),password=arg("password")||process.env.BOOTSTRAP_ADMIN_PASSWORD||"",name=arg("name")||process.env.BOOTSTRAP_ADMIN_NAME||"System Administrator";if(!email||!/^\S+@\S+\.\S+$/.test(email))throw new Error("Provide a valid admin email");if(password.length<10||password.length>72)throw new Error("Admin password must contain 10 to 72 characters");await connectDb();const passwordHash=await bcrypt.hash(password,12);const user=await User.findOneAndUpdate({email},{name,email,passwordHash,role:"super_admin",isActive:true,mustChangePassword:true},{upsert:true,new:true,setDefaultsOnInsert:true});console.log(`Super Admin ready: ${user.email}`)}main().then(()=>process.exit(0)).catch(e=>{console.error(e);process.exit(1)})
