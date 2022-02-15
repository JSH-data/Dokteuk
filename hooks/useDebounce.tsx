interface useDebounceProps {
  cb: () => void;
  ms: number;
}

const useDebounce = ({ cb, ms }: useDebounceProps) => {
  let timer: any = null;

  const paddingFunction = function () {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => cb(), ms);
  };
  return paddingFunction;
};

export default useDebounce;
