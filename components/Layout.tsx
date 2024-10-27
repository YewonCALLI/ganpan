import Header from "./Header";
interface LayoutProps {
    children: React.ReactNode;
    noHeader?: boolean;
}

const Layout = (props: LayoutProps) => {
    const { children, noHeader } = props;
    return (
        <div className="flex justify-center w-full" >
            <div className="flex flex-wrap justify-center w-full">
                {!noHeader && <Header />}
                {children}
            </div>
        </div>
    );
};

export default Layout;