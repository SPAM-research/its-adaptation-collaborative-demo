export interface IProblemText {
	id: number;
	language: string;
	text: string;
}

export interface IProblem {
	id: number;
	name: string;
	texts: ReadonlyArray<IProblemText>;
}
