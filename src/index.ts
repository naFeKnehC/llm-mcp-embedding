import { ChatOpenai } from "./ChatOpenai";

const main = () => {
  const chatOpenai = new ChatOpenai({
    model: "openai/gpt-4.1-nano",
    systemPrompt: "You are a helpful assistant.",
  });

  chatOpenai.chat("Hello, how are you?");
};

main();
