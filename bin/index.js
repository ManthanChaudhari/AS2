#!/usr/bin/env node

import { execSync } from "child_process";

import fs from "fs";
 
const repo = "ManthanChaudhari/create-brightinfonet-nextjs"; // replace this with your repo

const folderName = process.argv[2] || "my-next-app";
 
console.log(`🚀 Creating a new Next.js app in "${folderName}"...`);
 
try {

  // Clone the repository without git history

  execSync(`git clone --depth 1 https://github.com/${repo}.git ${folderName}`, { 

    stdio: "inherit" 

  });

  // Remove .git directory

  const gitDir = `${folderName}/.git`;

  if (fs.existsSync(gitDir)) {

    fs.rmSync(gitDir, { recursive: true, force: true });

  }
 
  console.log("📦 Installing dependencies...");

  execSync(`cd ${folderName} && npm install`, { stdio: "inherit" });
 
  console.log("✅ All done! Run:");

  console.log(`  cd ${folderName}`);

  console.log("  npm run dev");

} catch (error) {

  console.error("❌ Error creating app:", error.message);

  process.exit(1);

}
 