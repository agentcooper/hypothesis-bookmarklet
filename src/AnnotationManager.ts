import { toTextPosition } from 'dom-anchor-text-quote';
import { toRange } from 'dom-anchor-text-position';

declare namespace CSS {
	var highlights: Map<string, Set<Range>>;
}

declare global {
	class Highlight extends Set<Range> {
		constructor(range: Range);
	}
}

type ClickHandler<Annotation> = (annotation: Annotation) => void;

interface Options<Annotation> {
	onClick: ClickHandler<Annotation>;
}

export interface BaseAnnotation {
	id: string;
	exact: string;
}

export class AnnotationManager<Annotation extends BaseAnnotation> {
	private highlightToAnnotation = new Map<Highlight, Annotation>();

	public onClick: ClickHandler<Annotation>;

	constructor(options: Options<Annotation>) {
		this.onClick = options.onClick;
		this.attachGlobalClickHandler();
	}

	public static createAnnotationFromSelection(): BaseAnnotation | undefined {
		const selection = window.getSelection();
		if (!selection || selection.rangeCount === 0) {
			return;
		}
		const content = selection.getRangeAt(0).toString().trim();
		if (content.length === 0) {
			return;
		}
		return {
			id: `h-${Date.now()}`,
			exact: content,
		};
	}

	public addAnnotation(annotation: Annotation): void {
		const range = this.findRangeFromText(annotation.exact);
		if (!range) {
			return;
		}
		const highlight = new Highlight(range);
		const key = this.getKey(annotation);
		CSS.highlights.set(key, highlight);
		this.highlightToAnnotation.set(highlight, annotation);
		this.addStyle(
			key,
			`::highlight(${key}) {
        background-color: green;
        color: white;
      }`
		);
	}

	public removeAnnotation(annotation: Annotation): void {
		const key = this.getKey(annotation);
		CSS.highlights.delete(key);
		this.removeStyle(key);
	}

	public setAnnotations(annotations: Annotation[]): void {
		this.removeAnnotations();
		for (const annotation of annotations) {
			this.addAnnotation(annotation);
		}
	}

	public removeAnnotations(): void {
		for (const annotation of this.highlightToAnnotation.values()) {
			this.removeAnnotation(annotation);
		}
	}

	private attachGlobalClickHandler(): void {
		document.body.addEventListener('click', (event) => {
			if (event.defaultPrevented) {
				return;
			}

			const selection = window.getSelection();
			if (!selection || selection.rangeCount === 0 || !selection.isCollapsed) {
				return;
			}

			const clickedRange = selection.getRangeAt(0);

			const annotation = this.findAnnotationFromRange(clickedRange);
			if (!annotation) {
				return;
			}

			this.onClick(annotation);
		});
	}

	private findAnnotationFromRange(range: Range): Annotation | undefined {
		for (const highlight of CSS.highlights.values()) {
			for (const r of highlight) {
				if (r.isPointInRange(range.startContainer, range.startOffset)) {
					return this.highlightToAnnotation.get(highlight);
				}
			}
		}
	}

	private findRangeFromText(text: string): Range | undefined {
		const position = toTextPosition(document.body, {
			exact: text,
		});
		if (!position) {
			return undefined;
		}
		const range = toRange(document.body, position);
		return range;
	}

	private addStyle(id: string, content: string): void {
		var style = document.createElement('style');
		style.id = `style-${id}`;
		style.innerHTML = content.trim();
		document.head.appendChild(style);
	}

	private removeStyle(id: string) {
		document.getElementById(`style-${id}`)?.remove();
	}

	private getKey(annotation: Annotation): string {
		return annotation.id;
	}
}
