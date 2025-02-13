import React, { useEffect } from "react";
import { forwardRef } from "react";
import image from "../../utls/pngwing.png";
import styles from "./RepoComp.module.css";
import { ComponentProps } from "../../utls/type";

const RepoeComp: React.FC<ComponentProps> = forwardRef(
  ({ name, description, html_url, stargazers_count, updated_at }, ref) => {
    const stars: string[] = [];
    useEffect(() => {
      const renderStars = () => {
        for (let i = 0; i < stargazers_count; i++) {
          stars.push(image);
        }
      };
      renderStars();
    });

    return (
      <div ref={ref} className={styles.cont}>
        <h1>{name}</h1>
        <h2>Количество звезд: {stargazers_count}</h2>
        <div className={styles.arrows}>
          {stargazers_count > 0
            ? stars.map((it) => <img src={it} alt="звезда" />)
            : null}
        </div>
        <p>{description}</p>
        <p>{html_url}</p>
        <p>{updated_at}</p>
      </div>
    );
  }
);

export default RepoeComp;
