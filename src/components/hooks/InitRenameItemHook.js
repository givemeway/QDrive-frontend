export default function useInitRename(setEdit) {
  const initRename = () => {
    setEdit((prev) => ({ ...prev, editStart: true }));
  };

  return [initRename];
}
