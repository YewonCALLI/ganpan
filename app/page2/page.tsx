import dynamic from 'next/dynamic'

const Page2Component = dynamic(() => import('../../components/Page2'), {
  ssr: false,
  loading: () => <p>Loading...</p>
})

export default function Page2() {
  return <Page2Component />
}