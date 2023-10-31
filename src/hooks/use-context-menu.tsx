"use client";

import { useState, useCallback, useRef, useEffect } from "react";

export interface ContextMenuItem {
	label: string;
	action: () => void;
}

interface ContextMenuState {
	x: number;
	y: number;
	menuItems: ContextMenuItem[];
	isOpen: boolean;
}

function useContextMenu() {
	const [contextMenuState, setContextMenuState] = useState<ContextMenuState>({
		x: 0,
		y: 0,
		menuItems: [],
		isOpen: false,
	});

	const contextMenuRef = useRef<HTMLDivElement>(null);

	const handleContextMenu = useCallback(
		(event: React.MouseEvent, menuItems: ContextMenuItem[]) => {
			event.preventDefault();
			const clickX = event.clientX;
			const clickY = event.clientY;
			setContextMenuState({
				x: clickX,
				y: clickY,
				menuItems: menuItems,
				isOpen: true,
			});
		},
		[]
	);

	const handleCloseContextMenu = useCallback(() => {
		setContextMenuState((prevState) => ({
			...prevState,
			isOpen: false,
		}));
	}, []);

	const handleMenuItemClick = useCallback(
		(action: () => void) => {
			action();
			handleCloseContextMenu();
		},
		[handleCloseContextMenu]
	);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				contextMenuRef.current &&
				!contextMenuRef.current.contains(event.target as Node)
			) {
				handleCloseContextMenu();
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, [handleCloseContextMenu]);

	return {
		contextMenuState,
		handleContextMenu,
		handleMenuItemClick,
		contextMenuRef,
	};
}

export default useContextMenu;
