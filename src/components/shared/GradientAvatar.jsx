const gradients = [
    "from-violet-600 to-fuchsia-500",
    "from-teal-600 to-cyan-500",
    "from-rose-600 to-pink-500",
    "from-amber-600 to-orange-500",
    "from-blue-600 to-indigo-500",
    "from-emerald-600 to-teal-500",
];

function hashString(str) {
    let hash = 0;
    for (let i = 0; i < (str || "").length; i++)
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    return Math.abs(hash);
}

function initials(name) {
    return (name || "?")
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

export default function GradientAvatar({ name, size = "md", className = "" }) {
    const sizeMap = {
        sm: "h-8 w-8 text-xs",
        md: "h-14 w-14 text-xl",
        lg: "h-20 w-20 text-3xl",
    };

    const gradient = gradients[hashString(name || "") % gradients.length];

    return (
        <div
            className={`shrink-0 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-black shadow-lg ${sizeMap[size]} ${className}`}
        >
            {initials(name)}
        </div>
    );
}
