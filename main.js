const serverUrl = "ENTER SERVERURL";
const appId = "ENTER APP ID";
Moralis.start({ serverUrl, appId });

// This is a super basic, non-refactored file, purely built for a mock up demo

// CORE FUNCTIONS

function renderGold(address, metadata) {
  document.querySelector("#goldContent").innerHTML = `
  <div class="container">
  <div class="row align-items-center">
    <div class="col-xl-6 col-lg-6">
      <div class="about-img">
        <img src="assets/img/about/about-1.png" alt="" class="w-100" />
        <img
          src="assets/img/about/about-left-shape.svg"
          alt=""
          class="shape shape-1"
        />
        <img
          src="assets/img/about/left-dots.svg"
          alt=""
          class="shape shape-2"
        />
      </div>
    </div>
    <div class="col-xl-6 col-lg-6">
      <div class="about-content">
        <div class="section-title mb-30">
          <h2 class="mb-25 wow fadeInUp" data-wow-delay=".2s">
            GOLD MEMBER ACCESS
          </h2>
          <p class="wow fadeInUp" data-wow-delay=".4s">
            Here is the protected content for being a gold member. Lorem
            ipsum dolor sit amet consectetur adipisicing elit. Libero,
            consequatur quisquam ut aperiam, facilis eum sunt itaque
            tempora, vero delectus maxime. Dicta nulla eum quas illum quia
            illo repellendus quos.
          </p>
        </div>
        <a
          href="javascript:void(0)"
          class="main-btn btn-hover border-btn wow fadeInUp"
          data-wow-delay=".6s"
          >Discover More</a
        >
      </div>
    </div>
  </div>
</div>
    `;
}

// Render HTML for Silver holders
function renderSilver(address, metadata) {
  document.querySelector("#silverContent").innerHTML = `
      <div class="container">
        <div class="row align-items-center">
          <div class="col-xl-6 col-lg-6">
            <div class="about-content">
              <div class="section-title mb-30">
                <h2 class="mb-25 wow fadeInUp" data-wow-delay=".2s">
                  SILVER MEMBER ACCESS
                </h2>
                <p class="wow fadeInUp" data-wow-delay=".4s">
                  Here is the protect content for being a Silver member. Lorem
                  ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
                  nonumy eirmod tempor invidunt ut labore et dolore magna
                  aliquyam erat, sed diam voluptua.
                </p>
              </div>
              <ul>
                <li>Quick Access</li>
                <li>Easily to Manage</li>
                <li>24/7 Support</li>
              </ul>
              <a
                href="javascript:void(0)"
                class="main-btn btn-hover border-btn wow fadeInUp"
                data-wow-delay=".6s"
                >Learn More</a
              >
            </div>
          </div>
          <div class="col-xl-6 col-lg-6 order-first order-lg-last">
            <div class="about-img-2">
              <img src="assets/img/about/about-2.png" alt="" class="w-100" />
              <img
                src="assets/img/about/about-right-shape.svg"
                alt=""
                class="shape shape-1"
              />
              <img
                src="assets/img/about/right-dots.svg"
                alt=""
                class="shape shape-2"
              />
            </div>
          </div>
        </div>
      </div>
  `;
}

// Display dynamic content based on Logged in / NFT holder status
function renderLoginContent(NFTs) {
  if (!NFTs) {
    document.querySelector("#loginContent").innerHTML = `
        <h1>RESTRICTED CONTENT</h1>
              <h2 class="h3 mb-3 fw-normal" id="login-title">
                You need a Moralis GCloud NFT
              </h2>
              <h3>Do You Have It?</h3>`;
  } else if (NFTs === "Silver" || NFTs === "Gold") {
    document.querySelector("#loginContent").innerHTML = `
    <h1>ACCESS GRANTED !!</h1>
    <h3>You have the NFT</h3>
    `;
  } else {
    document.querySelector("#loginContent").innerHTML = `
    <h1>ACCESS DENIED !!</h1>
    <h3>You don't have the NFT</h3>
    `;
  }
}

// CLOUD CODE CALLS
// Fetch the data from API via a cloud function

async function checkNFT() {
  const sessionToken = await Moralis.User.current().get("sessionToken");
  const ethAddress = await Moralis.User.current().get("ethAddress");
  const rawResponse = await fetch(`http://localhost:5454/secret`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sessionToken, ethAddress }),
  });
  console.log("fetching from node.js server test");
  const result = await rawResponse.json();
  console.log(result.NFTdata.result);

  let counter = 0;

  if (result.NFTdata.result?.length > 0) {
    result.NFTdata.result.forEach((e) => {
      const metadata = JSON.parse(e.metadata);
      const NFTmetadata = metadata.attributes[0].value;
      const theUser = result.user;

      const theHolder = e.owner_of;
      if (NFTmetadata === "Silver" && theUser === theHolder) {
        renderSilver(theUser, metadata);
        console.log(`This user has a silver item`);
        renderLoginContent("Silver");
        counter++;
      }
      if (NFTmetadata === "Gold" && theUser === theHolder) {
        renderGold(theUser, metadata);
        console.log(`This user has a Gold item`);
        renderLoginContent("Gold");
        counter++;
      }
    });
  }

  if (counter == 0) {
    renderLoginContent("None");
  }
}

// HELPER FUNCTIONS
async function login() {
  let user = Moralis.User.current();
  if (!user) {
    user = await Moralis.authenticate({
      signingMessage: "Log in using Moralis",
    })
      .then(function (user) {
        console.log("logged in user:", user);
        loggedIn(true);

        checkNFT();
      })
      .catch(function (error) {
        console.log(error);
      });
  } else {
    console.log("yo");
    loggedIn(true);
  }
}

async function logout() {
  console.log("clicked logout");
  Moralis.User.logOut();
  loggedIn(false);
  renderLoginContent(false);
}

function loggedIn(user) {
  if (user) {
    document.getElementById("btn-login").style.display = "none";
    document.getElementById("btn-logout").style.display = "block";
    document.querySelector("#silverContent").innerHTML = "";
    document.querySelector("#goldContent").innerHTML = "";
  } else {
    document.getElementById("btn-login").style.display = "block";
    document.getElementById("btn-logout").style.display = "none";
    document.querySelector("#silverContent").innerHTML = "";
    document.querySelector("#goldContent").innerHTML = "";
  }
}

// INITIALISE
loggedIn(Moralis.User.current());
if (Moralis.User.current()) {
  checkNFT();
} else {
  renderLoginContent(false);
}

// LISTENERS
document.getElementById("btn-login").onclick = login;
document.getElementById("btn-logout").onclick = logout;
