import { useState } from "react";

function Accordian({ title, children }) {
	const [open, setOpen] = useState(false);

	return (
		<div className="m-2 bg-gray-500 rounded-lg">
			<button
				onClick={() => setOpen(!open)}
				className="p-4 bg-gray-300 hover:bg-gray-400 rounded-lg flex items-center justify-between w-full transition-[background-color] duration-300"
			>
				<span>{title}</span>
				<svg className="fill-indigo-500 shrink-0 ml-8" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
					<rect
						y="7"
						width="16"
						height="2"
						rx="1"
						className={`transform origin-center transition duration-200 ease-out ${open && "!rotate-180"}`}
					/>
					<rect
						y="7"
						width="16"
						height="2"
						rx="1"
						className={`transform origin-center rotate-90 transition duration-200 ease-out ${open && "!rotate-180"}`}
					/>
				</svg>
			</button>
			<div
				className={`grid p-4 overflow-hidden transition-all duration-300 ease-in-out text-slate-600 ${
					open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
				}`}
			>
				<div className="overflow-hidden">{children}</div>
			</div>
		</div>
	);
}

export default Accordian;
