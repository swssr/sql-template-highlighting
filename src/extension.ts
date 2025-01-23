import * as vscode from 'vscode';

const SQL_TAGS = ['SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'GROUP BY', 'ORDER BY', 'HAVING', 'INSERT INTO', 'UPDATE', 'DELETE FROM'];
const SQL_FUNCTIONS = ['COUNT', 'SUM', 'AVG', 'MAX', 'MIN'];

export function activate(context: vscode.ExtensionContext) {
	console.log("SQL Template Highlighting is now active");

	const provider = vscode.languages.registerCompletionItemProvider(
		[{ scheme: "file", language: "typescript" }, { scheme: "file", language: "javascript" }],
		{
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
				const linePrefix = document.lineAt(position).text.substring(0, position.character);

				if(!isInSqlTemplate(document, position)){
					return undefined;
				}

				const completions = new Array<vscode.CompletionItem>();

				SQL_TAGS.forEach(keyword => {
					const completion = new vscode.CompletionItem(keyword, vscode.CompletionItemKind.Keyword);
					completion.detail = "SQL Keyword";
					completions.push(completion);
				});

				SQL_FUNCTIONS.forEach(func => {
					const completion = new vscode.CompletionItem(func, vscode.CompletionItemKind.Function);
					completion.detail = "SQL function";
					completion.insertText = new vscode.SnippetString(`${func}(\${1:*})`);
					completions.push(completion);
				});

				return completions;
			}
		}
	);

	context.subscriptions.push(provider);

}


function isInSqlTemplate(document: vscode.TextDocument, position: vscode.Position) {
	const text = document.getText();
	const offset = document.offsetAt(position);

	const lastSqlTag = text.lastIndexOf("sql`", offset);
	if(lastSqlTag === -1) { return false; }

	const nextBackTick = text.indexOf("`", lastSqlTag + 4);
	if(nextBackTick === -1 || nextBackTick < offset) { return false; }

	return true;
}

// This method is called when your extension is deactivated
export function deactivate() {}
