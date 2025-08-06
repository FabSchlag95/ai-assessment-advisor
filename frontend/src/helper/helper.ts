  export const scrollToElementById = (id:string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } else {
    console.warn(`Element with id "${id}" not found.`);
  }
}