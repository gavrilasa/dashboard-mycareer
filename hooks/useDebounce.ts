// hooks/useDebounce.ts

import { useState, useEffect } from "react";

/**
 * Custom hook untuk men-debounce sebuah nilai.
 * Hanya akan mengembalikan nilai terbaru setelah delay tertentu.
 * @param value Nilai yang ingin di-debounce (misal: dari input search).
 * @param delay Waktu tunda dalam milidetik (misal: 500ms).
 * @returns Nilai yang sudah di-debounce.
 */
export function useDebounce<T>(value: T, delay: number): T {
	const [debouncedValue, setDebouncedValue] = useState<T>(value);

	useEffect(() => {
		// Set timeout untuk update nilai setelah delay
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		// Bersihkan timeout jika `value` atau `delay` berubah
		// Ini mencegah update jika user terus mengetik
		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);

	return debouncedValue;
}
