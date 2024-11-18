import dynamic from 'next/dynamic'

const Page1 = dynamic(() => import('../components/Page1'), {
  ssr: false,
  loading: () => <p>Loading...</p>
})

export default function Home() {
  return <Page1 />
}