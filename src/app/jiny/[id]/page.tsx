"use client";

import useEffect from "react";
import { useRouter } from "next/navigation";

export default function Page({ params }: { params: { id: string } }) {
	return <div>My Post: {params.id}</div>;
}
