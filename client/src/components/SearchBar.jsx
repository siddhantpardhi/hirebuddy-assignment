import { useEffect, useState } from "react"
import Select from "react-select"
import axios from "axios"
import { backendURL } from "../constants"

export default function SearchBar({ onSearch }) {
    const [query, setQuery] = useState("")
    const [location, setLocation] = useState("")
    const [source, setSource] = useState("")
    const [locationOptions, setLocationOptions] = useState([])
    const [sourceOptions, setSourceOptions] = useState([])

    useEffect(() => {
        const fetchFilterData = async () => {
            try {
                const { data } = await axios.get(`${backendURL}/api/v1/meta/filters`)
                console.log("🚀 ~ fetchFilterData ~ data:", data)
                setLocationOptions(
                    data.data.location.map((loc) => ({ value: loc, label: loc }))
                );
                setSourceOptions(
                    data.data.sources.map((src) => ({ value: src, label: src }))
                );
            } catch (err) {
                console.error("Failed to load filter metadata:", err)
            }
        };
        fetchFilterData()
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault()
        onSearch({
            query,
            location: location?.value || "",
            source: source?.value || "",
        })
    }

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto p-4 flex flex-col sm:flex-row gap-4">
            <input
                type="text"
                placeholder="Search job role..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 px-4 py-2 border rounded-md focus:outline-none"
            />

            <div className="w-full sm:w-48">
                <Select
                    options={locationOptions}
                    value={location}
                    onChange={setLocation}
                    placeholder="Location"
                    isClearable
                />
            </div>

            <div className="w-full sm:w-48">
                <Select
                    options={sourceOptions}
                    value={source}
                    onChange={setSource}
                    placeholder="Source"
                    isClearable
                />
            </div>

            <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
                Search
            </button>
        </form>
    );
}