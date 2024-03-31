import { AnnotationManager } from './AnnotationManager';

const annotationManager = new AnnotationManager({
	onClick: (annotation) => {
		console.log('click', annotation);
	},
});

document.getElementById('button-highlight')!.addEventListener('click', () => {
	const annotation = AnnotationManager.createAnnotationFromSelection();
	if (!annotation) {
		return;
	}
	annotationManager.addAnnotation(annotation);
});

document.getElementById('button-set')!.addEventListener('click', () => {
	const testAnnotations = [
		{ id: 'a', exact: 'bachelor cheerful of mistaken' },
		{ id: 'b', exact: 'missed lovers' },
	];
	annotationManager.setAnnotations(testAnnotations);
});

document.getElementById('button-remove-all')!.addEventListener('click', () => {
	annotationManager.setAnnotations([]);
});

window.annotationManager = annotationManager;
