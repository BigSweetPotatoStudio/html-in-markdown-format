import * as vscode from "vscode";
import { prettify } from "htmlfy";

export function formatHtml(): void {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        vscode.window.showErrorMessage("没有打开的编辑器");
        return;
    }

    // 检查是否是 Markdown 文件
    if (editor.document.languageId !== "markdown") {
        vscode.window.showErrorMessage("此命令仅适用于 Markdown 文件");
        return;
    }

    const document = editor.document;
    const selection = editor.selection;

    // 如果有选中文本，只格式化选中的部分；否则格式化整个文档
    const range = selection.isEmpty
        ? new vscode.Range(
            0,
            0,
            document.lineCount - 1,
            document.lineAt(document.lineCount - 1).text.length
        )
        : selection;

    const text = document.getText(range);

    try {
        const formattedText = prettify(text);

        editor
            .edit((editBuilder) => {
                editBuilder.replace(range, formattedText);
            })
            .then((success) => {
                if (success) {
                    vscode.window.showInformationMessage("HTML 格式化完成");
                } else {
                    vscode.window.showErrorMessage("HTML 格式化失败");
                }
            });
    } catch (error) {
        vscode.window.showErrorMessage(`格式化错误: ${error}`);
    }
}

