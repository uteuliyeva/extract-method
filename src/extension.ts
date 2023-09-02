import * as vscode from "vscode";

export function activate({ subscriptions }: vscode.ExtensionContext) {
  const extractMethodCommand = "extract-method.extract-method";
  subscriptions.push(
    vscode.commands.registerCommand(extractMethodCommand, async () => {
      const editor: any = vscode.window.activeTextEditor;
      
      if (!editor) {
        return vscode.window.showErrorMessage("Open an Active Editor before Extracting a Method");
      }
      
      if (editor.selection.isEmpty) {
        return vscode.window.showErrorMessage("Please Select Text before Extracting a Method");
      }
      
      const { selection } = editor;
      const { document } = editor;
      const text = document.getText(selection);
      const position = selection.start;
      const edit = new vscode.WorkspaceEdit();
      const methodName = await vscode.window.showInputBox({ prompt: "Enter Method Name" });
      if (!methodName) {
        return vscode.window.showErrorMessage("Method Name is Required");
      }

      // Helper function to replace text and insert into editor
      const applyEdit = (newText: string) => {
        edit.delete(document.uri, selection);
        edit.insert(document.uri, position, newText);
        return vscode.workspace.applyEdit(edit);
      };

      if (editor.document.languageId === "python") {
        let newText = `def ${methodName}():\n\t${text}`;
        await applyEdit(newText);
      } 
      else if (editor.document.languageId === "typescript" || editor.document.languageId === "javascript") {
        let newText = `function ${methodName}() {\n\t${text}\n}`;
        await applyEdit(newText);
      } 
      else if (editor.document.languageId === "c") {
        let newText = `void ${methodName}()\n{\n\t${text}\n}`;
        await applyEdit(newText);
      } 
      else if (editor.document.languageId === "csharp") {
        // Added C# support
        let newText = `public void ${methodName}()\n{\n\t${text}\n}`;
        await applyEdit(newText);
      }
      // Add more languageId conditions as necessary
    }),
  );
}
