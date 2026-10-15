import Editor, { type OnMount } from "@monaco-editor/react";

export default function MonacoEditor({ value, onChange, height, onMount }: { value: string; onChange: (v: string) => void; height: string; onMount?: OnMount }) {
  return (
    <Editor
      height={height}
      language="cpp"
      theme="vs-dark"
      value={value}
      onChange={(v) => onChange(v ?? "")}
      onMount={onMount}
      loading={<div className="p-4 font-mono text-sm text-muted-foreground">Loading editor…</div>}
      options={{
        fontFamily: "JetBrains Mono, monospace",
        fontSize: 14,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 4,
        autoIndent: "full",
        matchBrackets: "always",
        bracketPairColorization: { enabled: true },
        quickSuggestions: true,
        padding: { top: 12 },
      }}
    />
  );
}
