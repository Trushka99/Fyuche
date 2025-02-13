import React, { useState, useEffect, ChangeEvent } from "react";
import loadingImage from "./utls/loader.svg";
import style from "./App.module.css";
import fetchAllRepos from "./utls/api";
import RepoeComp from "./Components/RepoComp/RepoComp";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./store/store";
import { setRepos, addRepos } from "./store/repoSlice";
import { ComponentProps } from "./utls/type";
const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [page, setPage] = useState<number>(1); // добавляем состояние для страницы
  const [userName, setUserName] = useState<{ name: string }>({ name: "" });
  const [debounceTimeout, setDebounceTimeout] = useState<any>(null); // состояние для таймера дебаунса
  const [currentUserName, setCurrentUserName] = useState<string>(""); // для отслеживания текущего имени пользователя

  const dispatch = useDispatch();
  const repos = useSelector((state: RootState) => state.repos.repos);
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;

    setUserName({ name });

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeout = setTimeout(() => {
      setPage(1);
      setCurrentUserName(name);
    }, 200);

    setDebounceTimeout(timeout);
  };

  useEffect(() => {
    return () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    };
  }, [userName, debounceTimeout]);

  useEffect(() => {
    const getRepos = async () => {
      if (!userName.name || currentUserName !== userName.name) {
        dispatch(setRepos([]));
      }
      if (page === 1) {
        setLoading(true);
      }
      try {
        const reposData = await fetchAllRepos(userName.name, page);
        if (reposData && Array.isArray(reposData) && reposData.length > 0) {
          dispatch(page === 1 ? setRepos(reposData) : addRepos(reposData));

          setLoading(false);
        } else {
          setLoading(false);
          if (page === 1) {
            dispatch(setRepos([]));
            setError("Нет репозиториев для данного пользователя.");
          }
        }
      } catch (err) {
        setError("Такого пользователя не существует");
        setLoading(false);
      }
    };

    getRepos();
  }, [userName.name, page, currentUserName, dispatch]);
  const lastRepoElementRef = React.useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observerCallback = async (entries: IntersectionObserverEntry[]) => {
      const lastElement = entries[0];
      if (lastElement.isIntersecting && !loading) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    };

    const observer = new IntersectionObserver(observerCallback, options);

    if (lastRepoElementRef.current) {
      observer.observe(lastRepoElementRef.current);
    }

    return () => {
      if (lastRepoElementRef.current) {
        observer.disconnect();
      }
    };
  }, [repos, loading, page, userName]); // следим за репозиториями и состоянием загрузки

  return (
    <article className={style.App}>
      <input
        className={style.input}
        name={"name"}
        onChange={onChange}
        placeholder="Введите имя пользователя"
      />
      {loading ? (
        <img className={style.line} src={loadingImage} alt="logo" />
      ) : (
        <div className={style.repos_cont}>
          {repos && Array.isArray(repos) && repos.length > 0 ? (
            repos.map((it: ComponentProps, index: number) => (
              <RepoeComp
                key={it.name}
                name={it.name}
                description={it.description}
                html_url={it.html_url}
                stargazers_count={it.stargazers_count}
                updated_at={it.updated_at}
                ref={repos.length === index + 1 ? lastRepoElementRef : null} // Передаем ref только для последнего элемента
              />
            ))
          ) : (
            <h1>{error}</h1>
          )}
        </div>
      )}
    </article>
  );
};

export default App;
