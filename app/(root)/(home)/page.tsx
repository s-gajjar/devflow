import {UserButton} from "@clerk/nextjs";

const Home = ()=> {

  return (
      <div>
          <UserButton/>
          <h1 className="h1-bold">DevFlow</h1>
      </div>
  );
}

export default Home;