const getSodas = async() => {
    try {
        return (await fetch("api/sodas")).json();
    } catch (error) {
        console.log(error);
    }
};

const showSodas = async() => {
    let sodas = await getSodas();
    let sodaDiv = document.getElementById("soda-div");
    sodaDiv.innerHTML = "";
    sodas.forEach((soda => {
        const section = document.createElement("section");
        sodaDiv.append(section);

        const a = document.createElement("a");
        a.href= "#";
        section.append(a);

        const h3 = document.createElement("h3");
        h3.innerHTML = soda.name;
        a.append(h3);

        a.onclick = (e) => {
            e.preventDefault();
            displayInfo(soda);
        };
    }));
};

const displayInfo = (soda) => {
    const sodaInfo = document.getElementById("soda-info");
    sodaInfo.innerHTML = "";

    const h3 = document.createElement("h3");
    h3.innerHTML = soda.name;
    sodaInfo.append(h3);

    const dLink = document.createElement("a");
    dLink.innerHTML = "	&#x2715;";
    sodaInfo.append(dLink);
    dLink.id = "delete-link";

    const eLink = document.createElement("a");
    eLink.innerHTML = "&#9998;";
    sodaInfo.append(eLink);
    eLink.id = "edit-link";

    const p = document.createElement("p");
    p.innerHTML = `Total Calories: ${soda.calories}`;
    sodaInfo.append(p);

    const p1 = document.createElement("p");
    p1.innerHTML = `Sugar Content: ${soda.sugar}g`;
    sodaInfo.append(p1);

    const p2 = document.createElement("p");
    p2.innerHTML = `Ounces per Can: ${soda.oz}oz`;
    sodaInfo.append(p2);

    const h4 = document.createElement("h4");
    h4.innerHTML = `Types of ${soda.name}`;
    sodaInfo.append(h4);

    const ul = document.createElement("ul");
    sodaInfo.append(ul);
    soda.subTypes.forEach((type) => {
        const li = document.createElement("li");
        li.innerHTML = type;
        ul.append(li);
    });

    eLink.onclick = (e) => {
        e.preventDefault();
        document.querySelector(".dialog").classList.remove("transparent");
        document.getElementById("add-title").innerHTML = "Edit Soda";
    };

    dLink.onclick = (e) => {
        e.preventDefault();
        deleteSoda(soda);
    };

    populateEditForm(soda);
};

const deleteSoda = async(soda) => {
    let response = await fetch(`/api/sodas/${soda._id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        }
    });

    if (response.status != 200) {
        console.log("error deleting");
        return;
    }

    let result = await response.json();
    showSodas();
    document.getElementById("soda-info").innerHTML = "";
    resetForm();
}

const populateEditForm = (soda) => {
    const form = document.getElementById("add-soda-form");
    form._id.value = soda._id;
    form.name.value = soda.name;
    form.sugar.value = soda.sugar;
    form.calories.value = soda.calories;
    form.oz.value = soda.oz;
    populateSubTypes(soda);
};

const populateSubTypes = (soda) => {
    const section = document.getElementById("type-boxes");

    soda.subTypes.forEach((subType) => {
        const input = document.createElement("input");
        input.type = "text";
        input.value = subType;
        section.append(input);
    });
}

const addEditSoda = async(e) => {
    e.preventDefault();
    const form = document.getElementById("add-soda-form");
    const formData = new FormData(form);
    let response;
    formData.append("subTypes", getTypes());

    if (form._id.value == -1) {
        formData.delete("_id");
        console.log(...formData);
        response = await fetch("/api/sodas", {
            method: "POST",
            body: formData
        });
        console.log("fetched");
    } else {
        console.log(...formData);

        response = await fetch(`/api/sodas/${form._id.value}`, {
            method: "PUT",
            body: formData
        });
    }

    let i = 0;

    if (response.status != 200) {
        const errorMessage = setInterval( () => {
            const resultDiv = document.getElementById("result");
            resultDiv.innerHTML = "Failed to post soda";
            i++;
            if (i > 3) {
                resultDiv.innerHTML = "";
                clearInterval(errorMessage);
            }

        }, 1000);
    }

    if (response.status = 200) {
        const successMessage = setInterval( () => {
            const resultDiv = document.getElementById("result");
            resultDiv.innerHTML = "Successfully posted soda";
            i++;
            if (i > 3) {
                resultDiv.innerHTML = "";
                clearInterval(successMessage);
            }

        }, 1000);
    }

    soda = await response.json();

    if (form._id.value != -1) {
        displayInfo(soda);
    }

    resetForm();
    document.querySelector(".dialog").classList.add("transparent");
    showSodas();
};

const getTypes = () => {
    const inputs = document.querySelectorAll("#type-boxes input");
    let types = [];

    inputs.forEach((input) => {
        types.push(input.value);
    });

    return types;
}

const resetForm = () => {
    const form = document.getElementById("add-soda-form");
    form.reset();
    form._id = "-1";
    document.getElementById("type-boxes").innerHTML = "";
};

const showHideAdd = (e) => {
    e.preventDefault();
    document.querySelector(".dialog").classList.remove("transparent");
    document.getElementById("add-title").innerHTML = "Add Soda";
    resetForm();
};

const addType = (e) => {
    e.preventDefault();
    const section = document.getElementById("type-boxes");
    const input = document.createElement("input");
    input.type = "text";
    section.append(input);
}

window.onload = () => {
    showSodas();
    document.getElementById("add-soda-form").onsubmit = addEditSoda;
    document.getElementById("add-link").onclick = showHideAdd;

    document.querySelector(".close").onclick = () => {
        document.querySelector(".dialog").classList.add("transparent");
    };

    document.getElementById("add-type").onclick = addType;
};