type StreamHandlers = {
  onStart?: () => void;
  onChunk?: (chunk: string) => void;
  onComplete?: () => void;
  onError?: (message?: string) => void;
};

export async function startChatStream(
  args: { message: string } & StreamHandlers
) {
  const { message, onStart, onChunk, onComplete, onError } = args;

  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, stream: true }),
  });

  if (!response.ok || !response.body) {
    onError?.("Failed to start stream");
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  onStart?.();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let splitIndex: number;
      while ((splitIndex = buffer.indexOf("\n\n")) !== -1) {
        const rawEvent = buffer.slice(0, splitIndex);
        buffer = buffer.slice(splitIndex + 2);

        const lines = rawEvent.split("\n");
        let eventType = "message";
        let data = "";
        for (const line of lines) {
          if (line.startsWith("event: ")) eventType = line.slice(7).trim();
          if (line.startsWith("data: ")) data += line.slice(6).trim();
        }

        if (eventType === "start") {
          onStart?.();
        } else if (eventType === "chunk") {
          try {
            const parsed = JSON.parse(data);
            if (parsed?.content) onChunk?.(parsed.content as string);
          } catch {
            onChunk?.(data);
          }
        } else if (eventType === "error") {
          try {
            const parsed = JSON.parse(data);
            onError?.(parsed?.error || "Unknown error");
          } catch {
            onError?.(data);
          }
        } else if (eventType === "complete") {
          onComplete?.();
        }
      }
    }
  } catch (e) {
    onError?.(e instanceof Error ? e.message : "Stream read error");
  } finally {
    onComplete?.();
    reader.releaseLock();
  }
}
