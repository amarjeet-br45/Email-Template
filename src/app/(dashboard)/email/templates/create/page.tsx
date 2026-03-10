"use client";

import Link from "next/link";
import { ArrowLeft, MousePointer2 } from "lucide-react";
import { mockTemplates } from "@/lib/mock-data";

export default function CreateTemplatePage() {
    return (
        <div className="mx-auto max-w-7xl space-y-8">
            <div className="flex items-center gap-4">
                <Link
                    href="/email/templates"
                    className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Create a Template</h1>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                <div className="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Start from a template</h2>
                        <p className="text-sm text-gray-500">Pick a starting point to speed up your work</p>
                    </div>
                    <Link
                        href="/email/templates/editor/blank"
                        className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-900 transition-hover hover:bg-gray-50"
                    >
                        <MousePointer2 className="h-4 w-4" />
                        Create from Scratch
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {mockTemplates.map((template) => (
                        <Link
                            key={template.id}
                            href={`/email/templates/editor/${template.id}`}
                            className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:border-blue-300 hover:shadow-md"
                        >
                            <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100">
                                <img
                                    src={template.image}
                                    alt={template.name}
                                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
                                    {template.name}
                                </h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
