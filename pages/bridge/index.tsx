import dynamic from "next/dynamic";

const DynamicComponentWithNoSSR = dynamic(() => import("./bridge"), {
  ssr: false,
});

function MyPage() {
  return <DynamicComponentWithNoSSR />;
}

export default MyPage;
