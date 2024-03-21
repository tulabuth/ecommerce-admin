export default function AuthLayout({children}:{children:React.ReactNode}){
    return(
        <div className="flex items-center justify-center max-h-full pt-5">
            {children}
        </div>
    )
}