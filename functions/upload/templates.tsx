import type { FC } from "hono/jsx";

export const UploadForm: FC<{
  id: string;
  imgUrl?: string;
  error?: string;
}> = (props) => (
  <div class="uploader">
    {props.error && <b>Error: {props.error}</b>}
    {props.imgUrl && (
      <div>
        <div>
          Image available at <a href={props.imgUrl}></a>
        </div>
        <img src={props.imgUrl}></img>
      </div>
    )}
    <form id="form" hx-encoding="multipart/form-data" hx-post="/upload">
      <input name="file" type="file" accept="image/png, image/jpeg"></input>
      <input name="id" type="text" placeholder="id" value={props.id}></input>
      <button type="submit">Upload</button>

      <progress id="progress" value="0" max="100"></progress>
    </form>
    <script
      dangerouslySetInnerHTML={{
        __html: /* js */ `
        htmx.on('#form', 'htmx:xhr:progress', function(evt) {
          htmx.find('#progress').setAttribute('value', evt.detail.loaded/evt.detail.total * 100)
        });
        `,
      }}
    />
  </div>
);
