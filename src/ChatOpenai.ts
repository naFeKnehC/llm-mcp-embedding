import { OpenAI } from "openai";
import { config } from "dotenv";
import { logTitle } from "./utils";

config();

export class ChatOpenai {
  private baseURL: string = process.env.OPENAI_BASE_URL || "";
  private apiKey: string = process.env.OPENAI_API_KEY || "";
  private model: string;

  private llm: OpenAI;
  private messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];
  private tools: OpenAI.Chat.ChatCompletionTool[] = [];

  constructor({
    model,
    tools = [],
    systemPrompt = "",
  }: {
    model: string;
    tools?: OpenAI.Chat.ChatCompletionTool[];
    systemPrompt?: string;
  }) {
    this.llm = new OpenAI({
      baseURL: this.baseURL,
      apiKey: this.apiKey,
    });

    this.model = model;
    this.tools = tools;

    if (systemPrompt) {
      this.messages.push({
        role: "system",
        content: systemPrompt,
      });
    }
  }

  public async chat(prompt: string): Promise<{
    content: string;
    toolCalls: OpenAI.Chat.ChatCompletionTool[];
  }> {
    logTitle("startChat");

    this.messages.push({
      role: "user",
      content: prompt,
    });

    const res = await this.llm.chat.completions.create({
      model: this.model,
      messages: this.messages,
      tools: this.tools,
      stream: true,
    });

    let content = "";
    let toolCalls: OpenAI.Chat.ChatCompletionTool[] = [];

    for await (const chunk of res) {
      const delta = chunk.choices[0].delta;
      content += delta.content || "";
    }

    return {
      content,
      toolCalls,
    };
  }
}
