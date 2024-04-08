import { AnnotationManager } from "./AnnotationManager";

const annotationManager = new AnnotationManager({
  onClick: (annotation) => {
    alert(JSON.stringify(annotation, null, 2));
  },
});

const testAnnotations = [
  {
    id: "a",
    exact: `Before the reintroduction of separated text (spaces between words) in the late Middle Ages, the ability to read silently was considered rather remarkable.`,
  },
  { id: "b", exact: "have more education" },
];
annotationManager.setAnnotations(testAnnotations);

document.getElementById("button-highlight")!.addEventListener("click", () => {
  const annotation = AnnotationManager.createAnnotationFromSelection();
  if (!annotation) {
    return;
  }
  annotationManager.addAnnotation(annotation);
});

document.getElementById("button-remove-all")!.addEventListener("click", () => {
  annotationManager.setAnnotations([]);
});

window.annotationManager = annotationManager;
