// source: http://ajennings.net/blog/a-million-digits-of-pi-in-9-lines-of-javascript.html

export const onRequest: PagesFunction = ({ params }) => {
  const length = BigInt(parseInt(params["length"] as string) + 20);

  let i = 1n;
  let x = 3n * 10n ** length;
  let pi = x;
  while (x > 0) {
    x = (x * i) / ((i + 1n) * 4n);
    pi += x / (i + 2n);
    i += 2n;
  }
  return new Response((pi / 10n ** 20n).toString());
};
