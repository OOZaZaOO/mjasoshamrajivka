import bcrypt from "bcryptjs";

async function readPassword(): Promise<string> {
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    const chunks: string[] = [];
    for await (const chunk of process.stdin) chunks.push(String(chunk));
    return chunks.join("").replace(/[\r\n]+$/, "");
  }

  process.stdout.write("Пароль: ");
  process.stdin.setEncoding("utf8");
  process.stdin.setRawMode(true);
  process.stdin.resume();

  return new Promise((resolve, reject) => {
    let value = "";

    const cleanup = () => {
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdin.removeListener("data", onData);
    };

    const onData = (chunk: string) => {
      if (chunk === "\u0003") {
        cleanup();
        reject(new Error("Cancelled"));
        return;
      }

      if (chunk === "\r" || chunk === "\n") {
        cleanup();
        process.stdout.write("\n");
        resolve(value);
        return;
      }

      if (chunk === "\u007f") {
        value = value.slice(0, -1);
        return;
      }

      value += chunk;
    };

    process.stdin.on("data", onData);
  });
}

const password = await readPassword();
if (!password) throw new Error("Password cannot be empty");
process.stdout.write(`${await bcrypt.hash(password, 12)}\n`);
