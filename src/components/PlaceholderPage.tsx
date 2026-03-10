export default function PlaceholderPage({ title }: { title: string }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
            <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold">?</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{title} Page</h1>
            <p className="text-gray-500 max-w-sm px-6">
                We're still working on this module. For now, you can explore the
                <a href="/email/templates" className="text-blue-600 font-medium hover:underline ml-1">Templates</a> section.
            </p>
        </div>
    );
}
