import { pathToRoot } from "../util/path"
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"

function PageTitle({ fileData, cfg, displayClass }: QuartzComponentProps) {
  const title = cfg?.pageTitle ?? "Untitled Quartz"
  const baseDir = pathToRoot(fileData.slug!)
  return (
    <div class={`page-title-container ${displayClass ?? ""}`}>
      <img
        src="https://github.com/chrisdburr.png"
        alt="Profile Picture"
        class="profile-pic"
      />
      <h1 class="page-title">
        <a href={baseDir}>{title}</a>
      </h1>
    </div>
  )
}

PageTitle.css = `
.page-title-container {
  text-align: center;
}

.profile-pic {
  width: 70%; /* Adjust as necessary */
  height: 70%; /* Adjust as necessary */
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px; /* Space between image and title */
}

.page-title {
  margin: 0;
}
`

export default (() => PageTitle) satisfies QuartzComponentConstructor
