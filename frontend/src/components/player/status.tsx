import { observer } from "mobx-react-lite";

interface SongTitleProps {
	title?: string;
	artist?: string;
}

export const SongTitle = observer(function ({ title, artist }: SongTitleProps) {
	return (
		<div className="song-title">
			<p className="font-bold text-foreground">
				{title || "No Song playing"}
				{artist && (
					<span className="font-normal text-muted-foreground">
						<br />
						{artist}
					</span>
				)}
			</p>
		</div>
	);
});
