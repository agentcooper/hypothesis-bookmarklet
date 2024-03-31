import { AnnotationManager, BaseAnnotation } from './AnnotationManager';
import * as Hypothesis from './hypothesis';

interface Annotation extends BaseAnnotation {
	note: string;
}

const annotationManager = new AnnotationManager<Annotation>({
	onClick: (annotation) => {
		const result = window.prompt(`Note "${annotation.exact.slice(0, 10)}..." (${annotation.id})`, annotation.note);
		if (result !== null && result !== annotation.exact) {
			if (result === 'x') {
				annotationManager.removeAnnotation(annotation);
				Hypothesis.deleteAnnotation(annotation.id);
			} else {
				annotation.exact = result;
				Hypothesis.updateAnnotation(annotation.id, { text: result });
			}
		}
	},
});

async function run() {
	const annotation = AnnotationManager.createAnnotationFromSelection();
	if (annotation) {
		annotationManager.addAnnotation({ ...annotation, note: '' });
		await Hypothesis.createAnnotation(annotation.exact);
	}

	const hypothesisAnnotations = await Hypothesis.fetchAnnotations();
	annotationManager.setAnnotations(
		hypothesisAnnotations.map((annotation) => {
			return {
				id: annotation.id,
				exact: annotation.target[0].selector[0].exact,
				note: annotation.text,
			};
		})
	);
}

run();
