"use client"

import { FaLightbulb } from "react-icons/fa";
import { FaCode, FaRocket } from "react-icons/fa6";
import { SiMongodb, SiNextdotjs, SiNodedotjs, SiReact } from "react-icons/si";



const Icons = () => {
    return (
        <div>

            <SiReact className="absolute top-16 left-10 text-cyan-600/15 text-8xl rotate-12" />

            <SiNextdotjs className="absolute top-24 right-56 text-slate-700/15 text-7xl -rotate-12" />

            <SiMongodb className="absolute bottom-20 left-80 text-emerald-700/15 text-8xl rotate-6" />

            <SiNodedotjs className="absolute bottom-10 right-10 text-green-700/15 text-8xl -rotate-6" />

            <FaRocket className="absolute top-1/2 left-40 text-teal-700/15 text-7xl -rotate-45" />

            <FaLightbulb className="absolute top-10 right-1/3 text-amber-700/15 text-7xl rotate-12" />

            <FaCode className="absolute bottom-62 right-80 text-sky-700/15 text-7xl -rotate-12" />
            <SiReact className="absolute bottom-40 left-1/3 text-cyan-700/10 text-6xl" />

            <FaRocket className="absolute top-40 right-10 text-teal-700/10 text-5xl" />

            <SiMongodb className="absolute top-1/2 right-1/2 text-emerald-700/10 text-5xl" />


        </div>
    );
};

export default Icons;