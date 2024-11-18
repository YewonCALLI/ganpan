import dynamic from 'next/dynamic'

const ThreeJSScene = dynamic(() => import('../../components/ThreeJSScene'), {
  ssr: false // 서버사이드 렌더링 비활성화
});

export default function Page() {
  return <ThreeJSScene />;
}