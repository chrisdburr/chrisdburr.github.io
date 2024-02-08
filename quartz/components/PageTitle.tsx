import { pathToRoot } from "../util/path"
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"

function PageTitle({ fileData, cfg, displayClass }: QuartzComponentProps) {
  const title = cfg?.pageTitle ?? "Untitled Quartz"
  const baseDir = pathToRoot(fileData.slug!)
  return (
    <div id="page-title-container">
      <img src="https://github.com/chrisdburr.png" alt="Profile Picture" class="profile-pic" />
      <h1 class="page-title">
        <a href="{baseDir}">{title}</a>
      </h1>
    </div>
  )
}

PageTitle.css = `
#page-title-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
  width: 100%
}

.profile-pic {
  width: 50%; /* Adjust as necessary */
  height: auto; /* Adjust for aspect ratio */
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px; /* Space between image and title */
}

.page-title {
  margin: 0;
}
`

export default (() => PageTitle) satisfies QuartzComponentConstructor
